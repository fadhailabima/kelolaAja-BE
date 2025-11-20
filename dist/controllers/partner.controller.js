"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartnerController = void 0;
const response_1 = require("../utils/response");
const client_1 = require("@prisma/client");
const partner_service_1 = require("../services/partner.service");
class PartnerController {
    static async listPublicPartners(req, res, next) {
        try {
            const locale = req.locale || client_1.Locale.id;
            const partners = await partner_service_1.PartnerService.getPublicPartners(locale);
            response_1.ResponseUtil.success(res, 'Partners retrieved successfully', partners);
        }
        catch (error) {
            next(error);
        }
    }
    static async listAllPartners(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const isActive = req.query.isActive;
            const result = await partner_service_1.PartnerService.getAllPartners(page, limit, search, isActive);
            response_1.ResponseUtil.success(res, 'Partners retrieved successfully', result.data, 200, result.pagination);
        }
        catch (error) {
            next(error);
        }
    }
    static async createPartner(req, res, next) {
        try {
            const result = await partner_service_1.PartnerService.createPartner(req.body, req.user.userId);
            response_1.ResponseUtil.created(res, 'Partner created successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async updatePartner(req, res, next) {
        try {
            const partnerId = parseInt(req.params.id);
            const result = await partner_service_1.PartnerService.updatePartner(partnerId, req.body, req.user.userId);
            response_1.ResponseUtil.success(res, 'Partner updated successfully', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async deletePartner(req, res, next) {
        try {
            const partnerId = parseInt(req.params.id);
            await partner_service_1.PartnerService.deletePartner(partnerId, req.user.userId);
            response_1.ResponseUtil.success(res, 'Partner deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PartnerController = PartnerController;
//# sourceMappingURL=partner.controller.js.map