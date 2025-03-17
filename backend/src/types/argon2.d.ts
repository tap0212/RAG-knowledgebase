declare module 'argon2' {
  export function hash(
    password: string,
    options?: {
      type?: number;
      memoryCost?: number;
      timeCost?: number;
      parallelism?: number;
      salt?: Buffer;
      saltLength?: number;
      hashLength?: number;
      raw?: boolean;
    },
  ): Promise<string>;

  export function verify(hash: string, password: string): Promise<boolean>;

  export const argon2id: number;
  export const argon2i: number;
  export const argon2d: number;
}
