import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const exportBotProject = async (wakitCode: string) => {
    const zip = new JSZip();

    // Generate package.json
    const packageJson = {
        name: "wakit-bot",
        version: "1.0.0",
        type: "module",
        scripts: {
            "start": "tsx src/index.ts",
            "dev": "tsx watch src/index.ts"
        },
        dependencies: {
            "@atharvh01/wakit": "latest"
        },
        devDependencies: {
            "tsx": "^4.7.1",
            "typescript": "^5.3.3",
            "@types/node": "^20.11.16"
        }
    };

    // Generate tsconfig.json
    const tsConfig = {
        compilerOptions: {
            target: "ES2022",
            module: "NodeNext",
            moduleResolution: "NodeNext",
            esModuleInterop: true,
            strict: true,
            skipLibCheck: true
        },
        include: ["src/**/*"]
    };

    zip.file("package.json", JSON.stringify(packageJson, null, 2));
    zip.file("tsconfig.json", JSON.stringify(tsConfig, null, 2));
    
    // Create src folder and add generated code
    const src = zip.folder("src");
    if (src) {
        src.file("index.ts", wakitCode);
    }

    // Create session folder
    zip.folder("session");

    // Create README.txt
    const readmeContent = `Thank you for using WAKit Studio!
Created by: Atharv Hatwar
Repository: https://github.com/atharvh01/wakit

To run this bot:
1. Run 'npm install'
2. Scan the QR code when you first start the bot.
3. Your session will be saved in the /session folder.
`;
    zip.file("README.txt", readmeContent);

    // Generate blob and download
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "wakit-bot.zip");
};
