import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 44410,
        strictPort: true,
        https: generateCerts(),
        proxy: {
            // proxy API requests to the ASP.NET backend
            "/api": {
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, "/api"),
                // target taken from src/setupProxy.js in ASP.NET React template
                target: process.env.ASPNETCORE_HTTPS_PORT
                    ? `https://localhost:${process.env.ASPNETCORE_HTTPS_PORT}`
                    : process.env.ASPNETCORE_URLS
                    ? process.env.ASPNETCORE_URLS.split(";")[0]
                    : "http://localhost:44410",
            },
        },
    },
});

/** Function taken from aspnetcore-https.js in ASP.NET React template */
function generateCerts() {
    const baseFolder =
        process.env.APPDATA !== undefined && process.env.APPDATA !== ""
            ? `${process.env.APPDATA}/ASP.NET/https`
            : `${process.env.HOME}/.aspnet/https`;
    const certificateArg = process.argv
        .map((arg) => arg.match(/--name=(?<value>.+)/i))
        .filter(Boolean)[0];
    const certificateName = certificateArg
        ? certificateArg.groups.value
        : process.env.npm_package_name;

    if (!certificateName) {
        console.error(
            "Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly."
        );
        process.exit(-1);
    }

    const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
    const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

    if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
        const outp = execSync(
            "dotnet " +
                [
                    "dev-certs",
                    "https",
                    "--export-path",
                    certFilePath,
                    "--format",
                    "Pem",
                    "--no-password",
                ].join(" ")
        );
        console.log(outp.toString());
    }

    return {
        cert: fs.readFileSync(certFilePath, "utf8"),
        key: fs.readFileSync(keyFilePath, "utf8"),
    };
}