"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../utils/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'dokocafe-secret-key-default';
const register = async (userData) => {
    const { email, password, full_name, role_id = 1 } = userData;
    // Check if user already exists
    const { data: existingUser, error: checkError } = await db_1.default
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
    if (checkError) {
        throw new Error(checkError.message);
    }
    if (existingUser) {
        throw new Error('Email already in use');
    }
    // Hash password
    const salt = await bcryptjs_1.default.genSalt(10);
    const password_hash = await bcryptjs_1.default.hash(password, salt);
    // Insert new user
    const { data: newUser, error: insertError } = await db_1.default
        .from('users')
        .insert([{
            email,
            password_hash,
            full_name,
            role_id
        }])
        .select('id, email, full_name, role_id, avatar_url')
        .single();
    if (insertError) {
        throw new Error(insertError.message);
    }
    return newUser;
};
exports.register = register;
const login = async (loginData) => {
    const { email, password } = loginData;
    // Find user by email
    const { data: user, error: userError } = await db_1.default
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
    if (userError) {
        throw new Error(userError.message);
    }
    if (!user) {
        throw new Error('Invalid email or password');
    }
    // Compare passwords
    const isMatch = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    // Create JWT payload
    const payload = {
        id: user.id,
        role_id: user.role_id
    };
    // Sign token
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    // Exclude password_hash from response
    const { password_hash, ...userWithoutPassword } = user;
    return {
        token,
        user: userWithoutPassword
    };
};
exports.login = login;
const getCurrentUser = async (userId) => {
    const { data: user, error } = await db_1.default
        .from('users')
        .select('id, email, full_name, role_id, avatar_url')
        .eq('id', userId)
        .maybeSingle();
    if (error) {
        throw new Error(error.message);
    }
    return user;
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=auth.service.js.map