import log from "./logger";

export type H4Service = () => Promise<void>;

export async function h4(services: H4Service[]) {
	const asciiArt = `
 _     _   __    
| |   | | / /    
| |__ | |/ /____ 
|  __)| |___   _)
| |   | |   | |  
|_|   |_|   |_|  
                  `;

	log({
		type: "INFO",
		message: `Starting H4\n${asciiArt}`,
		colour: "\x1b[35m", // MAGENTA
	});
	await Promise.all(services.map((service) => service()));
}
