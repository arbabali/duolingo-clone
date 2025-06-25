
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    const { lang } = req.query;

    if (!lang) {
        return res.status(400).json({ error: "Missing lang parameter" });
    }

    const filePath = path.join(process.cwd(), 'api', `question_${lang}.json`);
    console.log("🔍 Trying to read file:", filePath);

    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        res.status(200).json(data);
    } catch (error) {
        console.error("❌ Error reading/parsing file:", error.message);
        res.status(500).json({ error: `Failed to load data for lang=${lang}` });
    }
}
