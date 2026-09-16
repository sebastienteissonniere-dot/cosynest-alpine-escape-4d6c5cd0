const ftp = require("basic-ftp");
const path = require("path");

async function upload() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    const host = process.env.FTP_SERVER || process.argv[2];
    const user = process.env.FTP_USERNAME || process.argv[3];
    const password = process.env.FTP_PASSWORD || process.argv[4];

    if (!host || !user || !password) {
        console.error("Usage: node scripts/deploy-direct.cjs <host> <user> <password>");
        process.exit(1);
    }

    const distPath = path.join(__dirname, "../dist");
    const targets = ["/", "/sites/chaletcosynest.fr/", "/chaletcosynest.fr/"];

    try {
        console.log(`Connexion à ${host}...`);
        await client.access({
            host: host,
            user: user,
            password: password,
            secure: false
        });

        for (const target of targets) {
            console.log(`Transfert des fichiers vers ${target} ...`);
            await client.ensureDir(target);
            await client.uploadFromDir(distPath);
        }

        console.log("SUCCÈS BINGO ! Tous les dossiers cibles FTP ont été synchronisés !");
    } catch (err) {
        console.error("Erreur de transfert FTP:", err);
    }
    client.close();
}

upload();
