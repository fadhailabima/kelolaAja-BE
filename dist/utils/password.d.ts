export declare class PasswordUtil {
    private static readonly SALT_ROUNDS;
    static hash(password: string): Promise<string>;
    static compare(password: string, hash: string): Promise<boolean>;
    static validateStrength(password: string): {
        valid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=password.d.ts.map