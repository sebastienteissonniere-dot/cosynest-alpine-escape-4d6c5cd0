const ftp = require("basic-ftp");
const path = require("path");

async function upload() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    const host = process.env.FTP_SERVER || process.argv[2];
    const user = process.env.FTP_USERNAME || process.argv[3];
    const password = process.env.FTP_PASSWORD || process.argv[4];
    const remoteDir = process.env.FTP_PATH || process.argv[5] || "/sites/chaletcosynest.fr/";

    if (!host || !user || !password) {
        console.error("Usage: node scripts/deploy-direct.js <host> <user> <password> [remoteDir]");
        process.exit(1);
    }

    try {
        console.log(`Connexion à ${host}...`);
        await client.access({
            host: host,
            user: user,
            password: password,
            secure: false
        });
        console.log(`Connecté ! Transfert des fichiers locaux de dist/ vers ${remoteDir}...`);
        await client.ensureDir(remoteDir);
        await client.uploadFromDir(path.join(__dirname, "../dist"));
        console.log("SUCCÈS ! Tous les fichiers locaux ont été transférés sur votre hébergement Infomaniak !");
    } catch (err) {
        console.error("Erreur de transfert FTP:", err);
    }
    client.close();
}

upload();
