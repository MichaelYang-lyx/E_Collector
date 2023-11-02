"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionSignature = void 0;
const formatAbiItem_js_1 = require("../abi/formatAbiItem.js");
const extractFunctionParts_js_1 = require("../contract/extractFunctionParts.js");
const getFunctionSignature = (fn) => {
    if (typeof fn === 'string') {
        const name = (0, extractFunctionParts_js_1.extractFunctionName)(fn);
        const params = (0, extractFunctionParts_js_1.extractFunctionParams)(fn) || [];
        return `${name}(${params.map(({ type }) => type).join(',')})`;
    }
    return (0, formatAbiItem_js_1.formatAbiItem)(fn);
};
exports.getFunctionSignature = getFunctionSignature;
//# sourceMappingURL=getFunctionSignature.js.map