import fs from 'fs';
import base64url from 'base64url';
import path from 'path';

const configFilePath = path.resolve('./src/config.json');

// Configuration template
const configTemplate = {
  log: {
    access: "",
    error: "",
    loglevel: "warning"
  },
  inbounds: [
    {
      tag: "http",
      port: 1080,
      listen: "127.0.0.1",
      protocol: "http",
      sniffing: {
        enabled: true,
        destOverride: ["http", "tls"]
      },
      settings: {
        auth: "noauth",
        udp: true,
        allowTransparent: false
      }
    },
    {
      tag: "socks",
      port: 1081,
      listen: "127.0.0.1",
      protocol: "socks",
      sniffing: {
        enabled: true,
        destOverride: ["http", "tls"]
      },
      settings: {
        auth: "noauth",
        udp: true,
        allowTransparent: false
      }
    }
  ],
  outbounds: [],
  routing: {
    domainStrategy: "IPIfNonMatch",
    domainMatcher: "hybrid",
    rules: [
      {
        type: "field",
        domain: ["geosite:category-ads-all"],
        outboundTag: "block"
      },
      {
        type: "field",
        domain: ["geosite:cn"],
        outboundTag: "direct"
      },
      {
        type: "field",
        ip: ["geoip:private", "geoip:cn"],
        outboundTag: "direct"
      },
      {
        type: "field",
        port: "0-65535",
        outboundTag: "proxy"
      }
    ]
  }
};

// Decode vmess link
function decodeVmessLink(config) {
  const [protocol, encodedConfig] = config.split('://');
  const decodedStr = base64url.decode(encodedConfig);
  const configData = JSON.parse(decodedStr);
  configData.protocol = protocol;
  console.log("DecodeVmessLink: Decoded Config:", JSON.stringify(configData, null, 2));
  return configData;
}

// Decode trojan and vless link
function decodeTrolessLink(link) {
  const [protocol, rest] = link.split("://");
  if (protocol === 'vless' || protocol === 'trojan') {
    const [uuidAndHost, params] = rest.split('?');
    const [id, hostAndPort] = uuidAndHost.split('@');
    const [add, port] = hostAndPort.split(':');
    const queryParams = new URLSearchParams(params.split('#')[0]);
    console.log("Query Params:", Array.from(queryParams.entries()));

    let realitySettings = null;
    let flow = queryParams.get('flow') || ''; 
    if (protocol === 'vless' && queryParams.get('security') === 'reality')
      console.log("REALITY security detected!"); {
      realitySettings = {
        serverName: queryParams.get('sni'),
        publicKey: queryParams.get('pbk'),
        shortId: queryParams.get('sid'),
        fingerprint: queryParams.get('fp'),
        spiderX: decodeURIComponent(queryParams.get('spx') || '/'),
      };
    }

    const result = {
      protocol,
      id, 
      add,
      port,
      flow,
      scy: queryParams.get('security'),
      net: queryParams.get('type'),
      type: queryParams.get('headerType'),
      ps: decodeURIComponent(params.split('#')[1]),
      realitySettings,
    };

    console.log("DecodeTrolessLink: Decoded Config:", JSON.stringify(result, null, 2));
    return result;
  } else {
    throw new Error('Unsupported protocol or malformed link');
  }
}




// Decode Shadowsocks link
function decodeSSLink(link) {
  const rest = link.split("://")[1];
  const [base64, uri] = rest.split("#");
  const decoded = base64url.decode(base64);
  const [methodAndId, hostAndPort] = decoded.split("@");
  const [method, id] = methodAndId.split(":");
  const [add, port] = hostAndPort.split(":");
  const ps = decodeURIComponent(uri);
  return {
    protocol: "shadowsocks",
    method,
    id,
    add,
    port,
    ps
  };
}

// Create outbound config based on protocol
function createOutbound(config) {
  const protocol = config.protocol;

  const baseOutbound = {
    tag: "proxy",
    protocol,
    settings: {},
    streamSettings: {
      network: config.net || "tcp",
      security: config.scy || "none",
      tcpSettings: {
        header: {
          type: config.type || "none"
        }
      },
      // Placeholder for realitySettings, will be added if needed
      realitySettings: null
    },
    mux: {
      enabled: false,
      concurrency: -1
    }
  };

  switch (protocol) {
    case 'shadowsocks':
      baseOutbound.settings.servers = [
        {
          address: config.add,
          port: parseInt(config.port, 10),
          method: config.method,
          password: config.id
        }
      ];
      break;

    case 'trojan':
    case 'vless':
      baseOutbound.settings.vnext = [
        {
          address: config.add,
          port: parseInt(config.port, 10),
          users: [
            {
              id: config.uuid,
              encryption: protocol === 'vless' ? 'none' : undefined,
              flow: config.flow || ""
            }
          ]
        }
      ];

      // Handle REALITY settings for VLESS or Trojan protocol
      if (config.scy === 'reality') {
        if (!config.realitySettings) {
          throw new Error("REALITY settings are missing in the configuration.");
        }

        const { serverName, publicKey, shortId, fingerprint, spiderX } = config.realitySettings;

        if (!serverName || !publicKey || !shortId || !fingerprint) {
          throw new Error(
            "Incomplete REALITY settings. Please provide 'serverName', 'publicKey', 'shortId', and 'fingerprint'."
          );
        }

        // Modify streamSettings for 'reality' security
        baseOutbound.streamSettings.security = 'reality';

        // Add realitySettings to streamSettings
        baseOutbound.streamSettings.realitySettings = {
          serverName,
          publicKey,
          shortId,
          fingerprint,
          spiderX: spiderX || '/'
        };

        // Remove tcpSettings (reality doesn't use them)
        delete baseOutbound.streamSettings.tcpSettings;
      } else {
        // For non-reality protocols, use the existing tcpSettings
        baseOutbound.streamSettings.security = config.scy || 'none';
      }
      break;

    case 'vmess':
      baseOutbound.settings.vnext = [
        {
          address: config.add,
          port: parseInt(config.port, 10),
          users: [
            {
              id: config.id,
              alterId: parseInt(config.aid || 0, 10),
              security: config.scy || 'auto'
            }
          ]
        }
      ];
      break;

    default:
      throw new Error('Unsupported protocol: ' + protocol);
  }

  return [baseOutbound, { tag: "direct", protocol: "freedom", settings: {} }];
}

function checkOutbounds(removeOutbound) {
  // Check if the config file exists
  if (!fs.existsSync(configFilePath)) {
    throw new Error('Config file does not exist.');
  }

  // Read the file contents
  const fileContents = fs.readFileSync(configFilePath, 'utf-8');

  // Parse the JSON data
  const config = JSON.parse(fileContents);

  if (config.outbounds.length === 0) {

    throw new Error("Server Configuration is Empty")

  }

  if (removeOutbound) {

    config.outbounds = []

    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf-8');
  }

}

// Process configuration and save to file
function processConfig(config) {
  const outbound = createOutbound(config);
  configTemplate.outbounds = outbound;

  // Write updated config to file
  fs.writeFileSync(configFilePath, JSON.stringify(configTemplate, null, 2), 'utf-8');
}

export {
  decodeSSLink,
  decodeTrolessLink,
  decodeVmessLink,
  checkOutbounds,
  processConfig
};
