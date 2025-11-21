"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialService = void 0;
const prisma_1 = require("../utils/prisma");
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const translation_1 = require("../utils/translation");
class TestimonialService {
    static async getPublicTestimonials(locale, isFeatured) {
        const where = {
            isActive: true,
            deletedAt: null
        };
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }
        const testimonials = await prisma_1.prisma.testimonial.findMany({
            where,
            include: {
                translations: {
                    where: { locale }
                },
                photoFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true
                    }
                }
            },
            orderBy: { displayOrder: "asc" }
        });
        return testimonials.map((testimonial) => {
            const translation = testimonial.translations[0] || {};
            return {
                testimonialId: testimonial.testimonialId,
                name: testimonial.name,
                title: testimonial.title,
                company: testimonial.company,
                rating: testimonial.rating,
                isFeatured: testimonial.isFeatured,
                displayOrder: testimonial.displayOrder,
                quote: translation.quote || "",
                photo: testimonial.photoFile
                    ? {
                        fileId: testimonial.photoFile.fileId,
                        filePath: testimonial.photoFile.filePath,
                        altText: testimonial.photoFile.altText
                    }
                    : null
            };
        });
    }
    static async getPublicTestimonialById(testimonialId, locale) {
        const testimonial = await prisma_1.prisma.testimonial.findFirst({
            where: {
                testimonialId,
                isActive: true,
                deletedAt: null
            },
            include: {
                translations: {
                    where: { locale }
                },
                photoFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true
                    }
                }
            }
        });
        if (!testimonial) {
            throw new errors_1.NotFoundError("Testimonial not found");
        }
        const translation = testimonial.translations[0] || {};
        return {
            testimonialId: testimonial.testimonialId,
            name: testimonial.name,
            title: testimonial.title,
            company: testimonial.company,
            rating: testimonial.rating,
            isFeatured: testimonial.isFeatured,
            displayOrder: testimonial.displayOrder,
            quote: translation.quote || "",
            photo: testimonial.photoFile
                ? {
                    fileId: testimonial.photoFile.fileId,
                    filePath: testimonial.photoFile.filePath,
                    altText: testimonial.photoFile.altText
                }
                : null
        };
    }
    static async getAllTestimonials(page, limit, search, isFeatured, isActive) {
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } },
                { translations: { some: { quote: { contains: search, mode: "insensitive" } } } }
            ];
        }
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured === "true";
        }
        if (isActive !== undefined) {
            where.isActive = isActive === "true";
        }
        const [total, testimonials] = await Promise.all([
            prisma_1.prisma.testimonial.count({ where }),
            prisma_1.prisma.testimonial.findMany({
                where,
                include: {
                    translations: {
                        orderBy: { locale: "asc" }
                    },
                    photoFile: {
                        select: {
                            fileId: true,
                            filePath: true,
                            altText: true
                        }
                    },
                    creator: {
                        select: {
                            userId: true,
                            username: true,
                            email: true
                        }
                    },
                    updater: {
                        select: {
                            userId: true,
                            username: true,
                            email: true
                        }
                    }
                },
                orderBy: { displayOrder: "asc" },
                skip,
                take: limit
            })
        ]);
        const result = testimonials.map((testimonial) => ({
            testimonialId: testimonial.testimonialId,
            name: testimonial.name,
            title: testimonial.title,
            company: testimonial.company,
            photoFileId: testimonial.photoFileId,
            rating: testimonial.rating,
            isFeatured: testimonial.isFeatured,
            displayOrder: testimonial.displayOrder,
            isActive: testimonial.isActive,
            createdAt: testimonial.createdAt,
            updatedAt: testimonial.updatedAt,
            photo: testimonial.photoFile,
            creator: testimonial.creator,
            updater: testimonial.updater,
            translations: (0, translation_1.mergeAllTranslations)(testimonial.translations)
        }));
        return {
            data: result,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    static async createTestimonial(data, userId) {
        const { name, title, company, photoFileId, rating, isFeatured, displayOrder, translations } = data;
        if (!name || displayOrder === undefined) {
            throw new errors_1.ValidationError("name and displayOrder are required");
        }
        if (!translations || !translations.id) {
            throw new errors_1.ValidationError("Indonesian translation (id) is required");
        }
        if (photoFileId) {
            const photoFile = await prisma_1.prisma.mediaFile.findUnique({
                where: { fileId: photoFileId }
            });
            if (!photoFile) {
                throw new errors_1.NotFoundError("Photo file not found");
            }
        }
        if (rating !== undefined && (rating < 1 || rating > 5)) {
            throw new errors_1.ValidationError("Rating must be between 1 and 5");
        }
        const testimonial = await prisma_1.prisma.testimonial.create({
            data: {
                name,
                title: title || null,
                company: company || null,
                photoFileId: photoFileId || null,
                rating: rating || null,
                isFeatured: isFeatured || false,
                displayOrder,
                isActive: true,
                createdBy: userId,
                updatedBy: userId,
                translations: {
                    create: [
                        {
                            locale: client_1.Locale.id,
                            quote: translations.id.quote
                        },
                        ...(translations.en
                            ? [
                                {
                                    locale: client_1.Locale.en,
                                    quote: translations.en.quote
                                }
                            ]
                            : [])
                    ]
                }
            },
            include: {
                translations: true,
                photoFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true
                    }
                },
                creator: {
                    select: {
                        userId: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        return {
            ...testimonial,
            translations: (0, translation_1.mergeAllTranslations)(testimonial.translations)
        };
    }
    static async updateTestimonial(testimonialId, data, userId) {
        const { name, title, company, photoFileId, rating, isFeatured, displayOrder, isActive, translations } = data;
        const existingTestimonial = await prisma_1.prisma.testimonial.findUnique({
            where: { testimonialId }
        });
        if (!existingTestimonial || existingTestimonial.deletedAt) {
            throw new errors_1.NotFoundError("Testimonial not found");
        }
        if (photoFileId) {
            const photoFile = await prisma_1.prisma.mediaFile.findUnique({
                where: { fileId: photoFileId }
            });
            if (!photoFile) {
                throw new errors_1.NotFoundError("Photo file not found");
            }
        }
        if (rating !== undefined && rating !== null && (rating < 1 || rating > 5)) {
            throw new errors_1.ValidationError("Rating must be between 1 and 5");
        }
        const updateData = {
            updatedBy: userId
        };
        if (name)
            updateData.name = name;
        if (title !== undefined)
            updateData.title = title;
        if (company !== undefined)
            updateData.company = company;
        if (photoFileId !== undefined)
            updateData.photoFileId = photoFileId;
        if (rating !== undefined)
            updateData.rating = rating;
        if (isFeatured !== undefined)
            updateData.isFeatured = isFeatured;
        if (displayOrder !== undefined)
            updateData.displayOrder = displayOrder;
        if (isActive !== undefined)
            updateData.isActive = isActive;
        await prisma_1.prisma.testimonial.update({
            where: { testimonialId },
            data: updateData
        });
        if (translations) {
            for (const locale of Object.values(client_1.Locale)) {
                if (translations[locale]) {
                    await prisma_1.prisma.testimonialTranslation.upsert({
                        where: {
                            testimonialId_locale: {
                                testimonialId,
                                locale
                            }
                        },
                        create: {
                            testimonialId,
                            locale,
                            quote: translations[locale].quote
                        },
                        update: {
                            quote: translations[locale].quote
                        }
                    });
                }
            }
        }
        const updatedTestimonial = await prisma_1.prisma.testimonial.findUnique({
            where: { testimonialId },
            include: {
                translations: true,
                photoFile: {
                    select: {
                        fileId: true,
                        filePath: true,
                        altText: true
                    }
                },
                updater: {
                    select: {
                        userId: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        return {
            ...updatedTestimonial,
            translations: (0, translation_1.mergeAllTranslations)(updatedTestimonial.translations)
        };
    }
    static async deleteTestimonial(testimonialId, userId) {
        const testimonial = await prisma_1.prisma.testimonial.findUnique({
            where: { testimonialId }
        });
        if (!testimonial || testimonial.deletedAt) {
            throw new errors_1.NotFoundError("Testimonial not found");
        }
        await prisma_1.prisma.testimonial.update({
            where: { testimonialId },
            data: {
                deletedAt: new Date(),
                isActive: false,
                updatedBy: userId
            }
        });
    }
}
exports.TestimonialService = TestimonialService;
//# sourceMappingURL=testimonial.service.js.map