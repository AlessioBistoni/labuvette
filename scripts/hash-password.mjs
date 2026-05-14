#!/usr/bin/env node
import bcrypt from "bcryptjs";

const pwd = process.argv[2];
if (!pwd || pwd.length < 8) {
  console.error('Uso: npm run hash-password -- "password-di-almeno-8-caratteri"');
  process.exit(1);
}

const hash = bcrypt.hashSync(pwd, 12);
console.log("Hash bcrypt (per aggiornamenti manuali nel DB o riferimento):");
console.log(hash);
