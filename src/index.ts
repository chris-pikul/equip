const isProduction = process.env.NODE_ENV === 'production';

export default function CLI():void {
  console.log('Is Production?', isProduction);
}
