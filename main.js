process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
import './config.js';
import { createRequire } from 'module';
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import 'ws';
import { readdirSync, unlinkSync, existsSync, readFileSync, watch } from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk';
import fsDefault from 'fs';
import { watchFile, unwatchFile } from 'fs';
import syntaxError from 'syntax-error';
import 'os';
import { format } from 'util';
import 'pino';
import pinoA from 'pino';
import pinoB from 'pino';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import readline from 'readline';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import './lib/mongoDB.js';
import store from './lib/store.js';
import readlineDefault from 'readline';
import NodeCache from 'node-cache';
import boxen from 'boxen';
import googleLibPhoneNumber from 'google-libphonenumber';
const { PhoneNumberUtil } = googleLibPhoneNumber;
const phoneUtil = PhoneNumberUtil.getInstance();
const {
  DisconnectReason,
  useMultiFileAuthState,
  MessageRetryMap,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser
} = await import("@whiskeysockets/baileys");
const { chain } = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
protoType();
serialize();

global.__filename = function filename(file = import.meta.url, unix = platform !== 'win32') {
  return unix ? (/^file:\/\//.test(file) ? fileURLToPath(file) : file) : pathToFileURL(file).toString();
};

global.__dirname = function dirname(file = import.meta.url) {
  return path.dirname(global.__filename(file, true));
};

global.__require = function require(file = import.meta.url) {
  return createRequire(file);
};

global.API = (name, pathSuffix = '/', query = {}, keyName) => {
  const base = (global.APIs && name in global.APIs) ? global.APIs[name] : name;
  if (!query && !keyName) return base + pathSuffix;
  const params = { ...(query || {}) };
  if (keyName) params[keyName] = global.APIKeys?.[base];
  return base + pathSuffix + (Object.keys(params).length ? '?' + new URLSearchParams(Object.entries(params)).toString() : '');
};

global.timestamp = { start: new Date() };

const __dirname = global.__dirname(import.meta.url);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());

global.prefix = new RegExp('^[' + (opts.prefix || "*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®&.\\-.@").replace(/[|\\{}()[\]^$+*.\-\^]/g, "\\$&") + ']');

let cloudDBAdapter = null;
try {
  const possible = await import('./lib/cloudDBAdapter.js').catch(() => null);
  cloudDBAdapter = possible?.default || possible;
} catch {}

global.db = new Low(/https?:\/\//.test(opts.db || '') && cloudDBAdapter ? new cloudDBAdapter(opts.db) : new JSONFile("database.json"));
global.DATABASE = global.db;

global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise(resolve => {
      const id = setInterval(async function () {
        if (!global.db.READ) {
          clearInterval(id);
          resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
        }
      }, 1000);
    });
  }
  if (global.db.data !== null && global.db.data !== undefined) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {})
  };
  global.db.chain = chain(global.db.data);
};
await loadDatabase();

global.chatgpt = new Low(new JSONFile(path.join(__dirname, "/db/chatgpt.json")));
global.loadChatgptDB = async function loadChatgptDB() {
  if (global.chatgpt.READ) {
    return new Promise(resolve => {
      const id = setInterval(async function () {
        if (!global.chatgpt.READ) {
          clearInterval(id);
          resolve(global.chatgpt.data === null ? global.loadChatgptDB() : global.chatgpt.data);
        }
      }, 1000);
    });
  }
  if (global.chatgpt.data !== null && global.chatgpt.data !== undefined) return;
  global.chatgpt.READ = true;
  await global.chatgpt.read().catch(console.error);
  global.chatgpt.READ = null;
  global.chatgpt.data = {
    users: {},
    ...(global.chatgpt.data || {})
  };
  global.chatgpt.chain = chain(global.chatgpt.data);
};
await loadChatgptDB();

global.authFile = 'session';
const { state, saveState, saveCreds } = await useMultiFileAuthState(global.authFile);

const msgRetryCounterMap = new Map();
const msgRetryCounterCache = new NodeCache();

const { version } = await fetchLatestBaileysVersion();

let phoneNumber = global.botNumberCode || '';
const methodCodeQR = process.argv.includes('qr');
const methodCode = !!phoneNumber || process.argv.includes('code');
const methodMobile = process.argv.includes('mobile');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
const question = (q) => {
  rl.clearLine(rl.input, 0);
  return new Promise(resolve => {
    rl.question(q, answer => {
      rl.clearLine(rl.input, 0);
      resolve(answer.trim());
    });
  });
};

const styleGreen = chalk.bold.green;
const styleQR = chalk.bgBlue.white;
const styleText = chalk.bgMagenta.white;

let option;
if (methodCodeQR) option = '1';

if (!methodCodeQR && !methodCode && !existsSync('./' + global.authFile + "/creds.json")) {
  do {
    option = await question(styleGreen("Select an option:\n") + styleQR("1. QR code\n") + styleText("2. Pair Code\n--> "));
    if (!/^[1-2]$/.test(option)) {
      console.log(chalk.bold.redBright("NO SE PERMITE NÚMEROS QUE NO SEAN " + chalk.bold.greenBright('1') + " O " + chalk.bold.greenBright('2') + ", TAMPOCO LETRAS O SÍMBOLOS ESPECIALES.\n" + chalk.bold.yellowBright("CONSEJO: COPIE EL NÚMERO DE LA OPCIÓN Y PÉGUELO EN LA CONSOLA.")));
    }
  } while ((option !== '1' && option !== '2') || existsSync('./' + global.authFile + "/creds.json"));
}

const connectionOptions = {
  logger: pino({ level: "silent" }),
  printQRInTerminal: option == '1' ? true : !!methodCodeQR,
  mobile: methodMobile,
  browser: option == '1' ? ['MikuBot-MD', "Edge", '2.0.0'] : methodCodeQR ? ["mikuBot-MD", 'Edge', "2.0.0"] : ['Ubuntu', "Edge", "110.0.1587.56"],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: 'fatal' }))
  },
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
  syncFullHistory: true,
  getMessage: async msg => {
    try {
      const jid = jidNormalizedUser(msg.remoteJid);
      const loaded = await store.loadMessage(jid, msg.id);
      return loaded?.message || '';
    } catch (err) {
      console.error("Error al cargar mensaje de " + msg.remoteJid + ':', err.message);
      if (err.message && err.message.includes && err.message.includes("Bad MAC")) {
        console.warn("Se detectó un problema con las claves de sesión. Podría ser necesario resincronizar.");
      }
      return null;
    }
  },
  msgRetryCounterCache,
  msgRetryCounterMap,
  defaultQueryTimeoutMs: 0x7530,
  version
};

global.conn = makeWASocket(connectionOptions);

if (!existsSync('./' + global.authFile + '/creds.json')) {
  if (option === '2' || methodCode) {
    option = '2';
    if (!conn.authState.creds.registered) {
      let addNumber;
      if (phoneNumber) {
        addNumber = phoneNumber.replace(/[^0-9]/g, '');
      } else {
        do {
          phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright("Please, enter the WhatsApp number.\n" + chalk.bold.yellowBright("TIP: Copy the WhatsApp number and paste it into the console.") + "\n" + chalk.bold.yellowBright("Example: +201144148194") + "\n" + chalk.bold.magentaBright("---> "))));
          phoneNumber = phoneNumber.replace(/\D/g, '');
          if (!phoneNumber.startsWith('+')) phoneNumber = '+' + phoneNumber;
        } while (!(await isValidPhoneNumber(phoneNumber)));
        rl.close();
        addNumber = phoneNumber.replace(/\D/g, '');
        setTimeout(async () => {
          try {
            let pairing = await conn.requestPairingCode(addNumber);
            pairing = pairing?.match(/.{1,4}/g)?.join('-') || pairing;
            console.log(chalk.bgBlueBright.bold.white("CÓDIGO DE VINCULACIÓN:"), chalk.bold.white(pairing));
          } catch (e) {
            console.error(e);
          }
        }, 2000);
      }
    }
  }
}

conn.isInit = false;
conn.well = false;

if (!opts.test) {
  if (global.db) {
    setInterval(async () => {
      if (global.db.data) await global.db.write();
      if (opts.autocleartmp && (global.support || {}).find) {
        const tmpDirs = [os.tmpdir(), "tmp", global.authFile];
        tmpDirs.forEach(dir => {
          try {
            spawn("find", [dir, "-amin", '2', "-type", 'f', "-delete"]);
          } catch {}
        });
      }
    }, 30000);
  }
}

if (opts.server) {
  (await import('./server.js')).default(global.conn, PORT);
}

async function getMessage(msg) {
  return { conversation: "SimpleBot" };
}

async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin } = update;
  global.stopped = connection;
  if (isNewLogin) conn.isInit = true;
  const statusCode = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
  if (statusCode && statusCode !== DisconnectReason.loggedOut && conn?.ws?.socket == null) {
    await global.reloadHandler(true).catch(console.error);
    global.timestamp.connect = new Date();
  }
  if (global.db.data == null) await loadDatabase();
  if ((update.qr != 0 && update.qr != undefined) || methodCodeQR) {
    if (option == '1' || methodCodeQR) console.log(chalk.bold.yellow("\n✅ ESCANEA EL CÓDIGO QR EXPIRA EN 45 SEGUNDOS"));
  }
  if (connection == "open") {
    console.log(boxen(chalk.bold(" ¡CONECTADO CON WHATSAPP! "), {
      borderStyle: "round",
      borderColor: "green",
      title: chalk.green.bold("● CONEXIÓN ●"),
      titleAlignment: "center",
      float: "center"
    }));
  }
  const reasonCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
  if (connection === "close") {
    if (reasonCode === DisconnectReason.badSession) {
      console.log(chalk.bold.cyanBright("\n⚠️ SIN CONEXIÓN, BORRE LA CARPETA " + global.authFile + " Y ESCANEA EL CÓDIGO QR ⚠️"));
    } else if (reasonCode === DisconnectReason.connectionClosed) {
      console.log(chalk.bold.magentaBright("\n┆ ⚠️ CONEXION CERRADA, RECONECTANDO...."));
      await global.reloadHandler(true).catch(console.error);
    } else if (reasonCode === DisconnectReason.connectionLost) {
      console.log(chalk.bold.blueBright("\n┆ ⚠️ CONEXIÓN PERDIDA CON EL SERVIDOR, RECONECTANDO...."));
      await global.reloadHandler(true).catch(console.error);
    } else if (reasonCode === DisconnectReason.connectionReplaced) {
      console.log(chalk.bold.yellowBright("\n┆ ⚠️ CONEXIÓN REEMPLAZADA, SE HA ABIERTO OTRA NUEVA SESION, POR FAVOR, CIERRA LA SESIÓN ACTUAL PRIMERO."));
    } else if (reasonCode === DisconnectReason.loggedOut) {
      console.log(chalk.bold.redBright("\n⚠️ SIN CONEXIÓN, BORRE LA CARPETA " + global.authFile + " Y ESCANEA EL CÓDIGO QR ⚠️"));
      await global.reloadHandler(true).catch(console.error);
    } else if (reasonCode === DisconnectReason.restartRequired) {
      console.log(chalk.bold.cyanBright("\n┆ ❇️ CONECTANDO AL SERVIDOR..."));
      await global.reloadHandler(true).catch(console.error);
    } else if (reasonCode === DisconnectReason.timedOut) {
      console.log(chalk.bold.yellowBright("\n┆ ⌛ TIEMPO DE CONEXIÓN AGOTADO, RECONECTANDO...."));
      await global.reloadHandler(true).catch(console.error);
    } else {
      console.log(chalk.bold.redBright("\n⚠️❗ RAZON DE DESCONEXIÓN DESCONOCIDA: " + (reasonCode || "No encontrado") + " >> " + (connection || "No encontrado")));
    }
  }
}

process.on('uncaughtException', console.error);

let isInit = true;
let handler = await import('./handler.js');

global.reloadHandler = async function (shouldReconnect) {
  try {
    const imported = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    if (Object.keys(imported || {}).length) handler = imported;
  } catch (err) {
    console.error(err);
  }
  if (shouldReconnect) {
    const chats = global.conn.chats;
    try { global.conn.ws.close(); } catch {}
    conn.ev.removeAllListeners();
    global.conn = makeWASocket(connectionOptions, { chats });
    isInit = true;
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler);
    conn.ev.off("group-participants.update", conn.participantsUpdate);
    conn.ev.off("groups.update", conn.groupsUpdate);
    conn.ev.off("message.delete", conn.onDelete);
    conn.ev.off('connection.update', conn.connectionUpdate);
    conn.ev.off("creds.update", conn.credsUpdate);
  }

  conn.welcome = "*╔══════════════*\n*╟❧ @subject*\n*╠══════════════*\n*╟❧ @user*\n*╟❧ *مرحبا بك 👋\n*║*\n*╟❧ اقرأ الوصف :*\n\n@desc\n\n*║*\n*╟❧ !!*\n*╚══════════════*";
  conn.bye = "*╔══════════════*\n*╟❧ @user*\n*╟❧ *سيوناراااا 👋 \n*╚══════════════*";
  conn.spromote = "*@user 🎉رحبو بلمشرف الجديد للجروب🥳*";
  conn.sdemote = "*@user نأسف لسحب منك الاشراف لم تكمل واجبك علي اكمل وجه 😔💔*";
  conn.sDesc = "*تم تغير وصف المجموعة*\n\n*الوصف الجديد:* @desc";
  conn.sSubject = "*تم تغير اسم المجموعة *\n*الاسم الجديد:* @subject";
  conn.sIcon = "*تم تغير صورة المجموعة!!*";
  conn.sRevoke = "*تمت اعادة تعيين رابط المجموعة!*\n*الرابط:* @revoke";

  conn.handler = handler.handler.bind(global.conn);
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
  conn.onDelete = handler.deleteUpdate.bind(global.conn);
  conn.connectionUpdate = connectionUpdate.bind(global.conn);
  conn.credsUpdate = saveCreds.bind(global.conn, true);

  conn.ev.on('messages.upsert', conn.handler);
  conn.ev.on('group-participants.update', conn.participantsUpdate);
  conn.ev.on("groups.update", conn.groupsUpdate);
  conn.ev.on("message.delete", conn.onDelete);
  conn.ev.on('connection.update', conn.connectionUpdate);
  conn.ev.on("creds.update", conn.credsUpdate);

  isInit = false;
  return true;
};

const pluginFolder = global.__dirname(join(__dirname, "./plugins/index"));
const pluginFilter = name => /\.js$/.test(name);
global.plugins = {};

async function filesInit() {
  for (const fileName of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const filePath = global.__filename(join(pluginFolder, fileName));
      const imported = await import(filePath);
      global.plugins[fileName] = imported.default || imported;
    } catch (err) {
      conn.logger?.error?.(err);
      delete global.plugins[fileName];
    }
  }
}
filesInit().then(() => Object.keys(global.plugins)).catch(console.error);

global.reload = async (event, fileName) => {
  if (/\.js$/.test(fileName)) {
    const fullPath = global.__filename(join(pluginFolder, fileName), true);
    if (fileName in global.plugins) {
      if (existsSync(fullPath)) {
        conn.logger?.info?.("Se acaba de actualizar el plugin: '" + fileName + "'");
      } else {
        conn.logger?.warn?.("Se acaba de eliminar el plugin: '" + fileName + "'");
        return delete global.plugins[fileName];
      }
    } else {
      conn.logger?.info?.("Nuevo plugin: '" + fileName + "'");
    }
    const syntax = syntaxError(readFileSync(fullPath), fileName, { sourceType: 'module', allowAwaitOutsideFunction: true });
    if (syntax) {
      conn.logger?.error?.("Error de sintaxis al cargar '" + fileName + "'\n" + format(syntax));
    } else {
      try {
        const imported = await import(global.__filename(fullPath) + "?update=" + Date.now());
        global.plugins[fileName] = imported.default || imported;
      } catch (err) {
        conn.logger?.error?.("Error require plugin '" + fileName + "\n" + format(err) + "'");
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
      }
    }
  }
};
Object.freeze(global.reload);
watch(pluginFolder, global.reload);
await global.reloadHandler();

async function _quickTest() {
  const commands = [
    spawn("ffmpeg"),
    spawn("ffprobe"),
    spawn("ffmpeg", ['-hide_banner', "-loglevel", "error", "-filter_complex", 'color', "-frames:v", '1', '-f', "webp", '-']),
    spawn("convert"),
    spawn("magick"),
    spawn('gm'),
    spawn("find", ["--version"])
  ];
  const results = await Promise.all(commands.map(proc => {
    return Promise.race([new Promise(resolve => {
      proc.on("close", code => resolve(code !== 0x7f));
    }), new Promise(resolve => {
      proc.on("error", () => resolve(false));
    })]);
  }));
  Object.freeze(global.support);
}
_quickTest().then(() => conn.logger?.info?.(chalk.bold("✨ CARGANDO...\n".trim()))).catch(console.error);

let tmpClearFile = fileURLToPath(import.meta.url);
watchFile(tmpClearFile, () => {
  unwatchFile(tmpClearFile);
  console.log(chalk.bold.greenBright("SE ACTUALIZÓ 'main.js' CON ÉXITO".trim()));
  import(tmpClearFile + '?update=' + Date.now());
});

async function isValidPhoneNumber(number) {
  try {
    number = number.replace(/\s+/g, '');
    if (number.startsWith("+521")) number = number.replace("+521", '+52');
    else if (number.startsWith('+52') && number[4] === '1') number = number.replace("+52 1", '+52');
    const parsed = phoneUtil.parseAndKeepRawInput(number);
    return phoneUtil.isValidNumber(parsed);
  } catch {
    return false;
  }
}

function clearTmp() {
  try {
    const tmpDir = join(__dirname, "tmp");
    if (!existsSync(tmpDir)) return;
    const files = readdirSync(tmpDir);
    files.forEach(f => {
      try { unlinkSync(join(tmpDir, f)); } catch {}
    });
  } catch {}
}

function redefineConsoleMethod(method, base64List = []) {
  const original = console[method];
  console[method] = function () {
    let first = arguments[0];
    if (typeof first === 'string' && base64List.some(enc => {
      try { return first.includes(Buffer.from(enc, 'base64').toString('binary')); } catch { return false; }
    })) {
      arguments[0] = '';
    }
    original.apply(console, arguments);
  };
}

setInterval(async () => {
  if (global.stopped === "close" || !conn || !conn.user) return;
  clearTmp();
  console.log(chalk.bold.cyanBright("\n╭» 🟢 MULTIMEDIA 🟢\n│→ ARCHIVOS DE LA CARPETA TMP ELIMINADAS\n╰― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― ― 🗑️♻️"));
}, 240000);
