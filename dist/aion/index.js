"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
class Aion {
    constructor(nodeAddress) {
        this.getAccounts = () => __awaiter(this, void 0, void 0, function* () {
            const { data: { result } } = yield axios_1.default.post(this.nodeAddress, {
                jsonrpc: '2.0',
                method: 'eth_accounts',
                params: [],
                id: 1
            });
            return result;
        });
        this.getBalance = (address) => __awaiter(this, void 0, void 0, function* () {
            const { data: { result } } = yield axios_1.default.post(this.nodeAddress, {
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [address, 'latest'],
                id: 1
            });
            return +result;
        });
        this.unlock = (address, password) => __awaiter(this, void 0, void 0, function* () {
            const { data: { result } } = yield axios_1.default.post(this.nodeAddress, {
                jsonrpc: '2.0',
                method: 'personal_unlockAccount',
                params: [address, password],
                id: 1
            });
            return result;
        });
        this.deploy = ({ code, mainAccount, gas, gasPrice, contractArguments }) => __awaiter(this, void 0, void 0, function* () {
            const txHash = yield this.sendTransaction({
                from: mainAccount,
                data: code,
                gas,
                gasPrice
            });
            const txReceipt = yield this.getReceiptWhenMined(txHash);
            return { txHash, txReceipt };
        });
        this.sendTransaction = (params) => __awaiter(this, void 0, void 0, function* () {
            const { data: { result } } = yield axios_1.default.post(this.nodeAddress, {
                jsonrpc: '2.0',
                method: 'eth_sendTransaction',
                params: [params],
                id: 1
            });
            return result;
        });
        this.getReceiptWhenMined = (txHash) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                while (true) {
                    console.log('checking...');
                    let receipt = yield this.getTxReceipt(txHash);
                    if (receipt && receipt.contractAddress) {
                        resolve(receipt);
                        break;
                    }
                    yield sleep(3000);
                }
            }));
        });
        this.getTxReceipt = (txHash) => __awaiter(this, void 0, void 0, function* () {
            const { data: { result } } = yield axios_1.default.post(this.nodeAddress, {
                jsonrpc: '2.0',
                method: 'eth_getTransactionReceipt',
                params: [txHash],
                id: 1
            });
            return result;
        });
        this.estimateGas = ({ code, mainAccount, gas, gasPrice }) => __awaiter(this, void 0, void 0, function* () {
            const { data: { result } } = yield axios_1.default.post(this.nodeAddress, {
                jsonrpc: '2.0',
                method: 'eth_estimateGas',
                params: [
                    {
                        from: mainAccount,
                        data: code,
                        gas,
                        gasPrice
                    }
                ],
                id: 1
            });
            return result;
        });
        this.nodeAddress = nodeAddress;
    }
}
exports.default = Aion;
