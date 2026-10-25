// Atrapa zapisu „na blockchainie”: liczymy tylko skróty lokalnie, nic nie wychodzi do sieci.

export type Pokwitowanie = {
	wyboryId: string;
	hash: string;
	tx: string;
	czas: string;
};

const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");

// crypto.subtle działa tylko w bezpiecznym kontekście; telefon w sieci lokalnej (http://192.168…)
// go nie ma, więc wtedy liczymy SHA-256 w JS.
function sha256Js(dane: Uint8Array): string {
	const K = new Uint32Array([
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
	]);
	const H = new Uint32Array([
		0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
	]);
	const dl = dane.length;
	const bloki = Math.ceil((dl + 9) / 64) * 64;
	const m = new Uint8Array(bloki);
	m.set(dane);
	m[dl] = 0x80;
	const v = new DataView(m.buffer);
	v.setUint32(bloki - 4, dl * 8);
	v.setUint32(bloki - 8, Math.floor(dl / 0x20000000));
	const w = new Uint32Array(64);
	const r = (x: number, n: number) => (x >>> n) | (x << (32 - n));
	for (let o = 0; o < bloki; o += 64) {
		for (let i = 0; i < 16; i++) w[i] = v.getUint32(o + i * 4);
		for (let i = 16; i < 64; i++) {
			const s0 = r(w[i - 15], 7) ^ r(w[i - 15], 18) ^ (w[i - 15] >>> 3);
			const s1 = r(w[i - 2], 17) ^ r(w[i - 2], 19) ^ (w[i - 2] >>> 10);
			w[i] = w[i - 16] + s0 + w[i - 7] + s1;
		}
		let [a, b, c, d, e, f, g, h] = H;
		for (let i = 0; i < 64; i++) {
			const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) >>> 0;
			const t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
			h = g;
			g = f;
			f = e;
			e = (d + t1) >>> 0;
			d = c;
			c = b;
			b = a;
			a = (t1 + t2) >>> 0;
		}
		H[0] += a;
		H[1] += b;
		H[2] += c;
		H[3] += d;
		H[4] += e;
		H[5] += f;
		H[6] += g;
		H[7] += h;
	}
	const out = new Uint8Array(32);
	const ov = new DataView(out.buffer);
	H.forEach((x, i) => {
		ov.setUint32(i * 4, x);
	});
	return hex(out);
}

export async function sha256(tekst: string): Promise<string> {
	const dane = new TextEncoder().encode(tekst);
	if (globalThis.crypto?.subtle)
		return hex(new Uint8Array(await crypto.subtle.digest("SHA-256", dane)));
	return sha256Js(dane);
}

export { sha256Js as _sha256Js };

export function nowaSol(): string {
	return hex(crypto.getRandomValues(new Uint8Array(16)));
}

// Sól sprawia, że z hasha nie da się odgadnąć wyboru, przeliczając wszystkie opcje.
export async function hashGlosu(wyboryId: string, opcjaId: string, sol: string): Promise<string> {
	return sha256(`${wyboryId}|${opcjaId}|${sol}`);
}

export async function zapiszGlos(
	wyboryId: string,
	opcjaId: string,
	sol = nowaSol(),
	czas = new Date(),
): Promise<Pokwitowanie> {
	const hash = await hashGlosu(wyboryId, opcjaId, sol);
	const tx = `0x${(await sha256(`tx|${hash}`)).slice(0, 40)}`;
	return { wyboryId, hash, tx, czas: czas.toISOString() };
}

export const skrot = (h: string, n = 10) => `${h.slice(0, n)}…${h.slice(-6)}`;
