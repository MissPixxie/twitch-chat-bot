import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

export async function updateEnvFile(key: string, value: string) {
	try {
		const envPath = path.resolve(process.cwd(), ".env");
		let envContent = await fs.readFile(envPath, "utf-8");

		// Update or add the specified key
		if (envContent.includes(`${key}=`)) {
			envContent = envContent.replace(
				new RegExp(`${key}=.*`),
				`${key}=${value}`
			);
		} else {
			envContent += `\n${key}=${value}`;
		}

		await fs.writeFile(envPath, envContent);

		// Reload environment variables
		dotenv.config();
	} catch (error) {
		console.error(`Error updating ${key} in .env file:`, error);
	}
}
