import path from 'path';
import fs from 'fs';

export function printHeader():void {
  console.log('Equip - The developers equipment toolbox');
  console.log('----------------------------------------');
  console.log();
}

export function getPackage():Record<string, any> {
  const pkgPath = path.resolve(__dirname, '..', 'package.json');
  const pkgData = fs.readFileSync(pkgPath, { encoding: 'utf-8' });
  
  return JSON.parse(pkgData);
}
