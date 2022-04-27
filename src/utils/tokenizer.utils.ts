import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import base32Encode from 'base32-encode';
import base32Decode from 'base32-decode';
import jwt from 'jsonwebtoken';

function calculateChecksum(bytes: Buffer): number {
  // to distinguish between an identifier that is missing (e.g., it was never created or was deleted)
  // and one thatcould never possibly exist.
  const intValue = BigInt(`0x${bytes.toString('hex')}`);
  return Number(intValue % BigInt(37));
}

function getChecksumCharacter(checksumValue: number): string {
  // Base32 alphabet with five additional characters: *, ~, #, =, and U
  const alphabet = '0123456789ABCDEFG' + 'HJKMNPQRSTVWXYZ*~$=U';
  return alphabet[Math.abs(checksumValue)];
}

export function generateJwtToken(payload: { [key: string]: string }): string {
  const token = jwt.sign(payload, process.env.JWT_SECRET || 'DEV_SECRET', {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  });
  return token;
}

export function generateToken(): string {
  const token = generateIdWithChecksum(15);
  return token;
}

export function generateIdWithChecksum(sizeBytes: number): string {
  const bytes = crypto.randomBytes(sizeBytes);
  const checksum = calculateChecksum(bytes);
  const checksumChar = getChecksumCharacter(checksum);
  const encoded = base32Encode(bytes, 'Crockford');
  return encoded + checksumChar;
}

export function generateBase32EncodedUuidWithChecksum(): string {
  const b = Buffer.alloc(16);
  uuidv4(null, b);
  const checksum = calculateChecksum(b);
  const checksumChar = getChecksumCharacter(checksum);
  return base32Encode(b, 'Crockford') + checksumChar;
}

export function verifyId(identifier: string): boolean {
  const value = identifier.substring(0, identifier.length - 1);
  const checksumChar = identifier[identifier.length - 1];
  const buffer = Buffer.from(base32Decode(value, 'Crockford'));
  return getChecksumCharacter(calculateChecksum(buffer)) == checksumChar;
}