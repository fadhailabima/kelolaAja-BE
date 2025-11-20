import { prisma } from '../utils/prisma';
import { ValidationError, NotFoundError } from '../utils/errors';
import { Locale } from '@prisma/client';
import { mergeAllTranslations } from '../utils/translation';

export class TestimonialService {
  /**
   * Get all active testimonials for public (locale-aware)
   */
  static async getPublicTestimonials(locale: Locale, isFeatured?: boolean) {
    const where: any = {
      isActive: true,
      deletedAt: null,
    };

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    const testimonials: any = await prisma.testimonial.findMany({
      where,
      include: {
        translations: {
          where: { locale },
        },
        photoFile: {
          select: {
            fileId: true,
            filePath: true,
            altText: true,
          },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return testimonials.map((testimonial: any) => {
      const translation = testimonial.translations[0] || {};
      return {
        testimonialId: testimonial.testimonialId,
        name: testimonial.name,
        title: testimonial.title,
        company: testimonial.company,
        rating: testimonial.rating,
        isFeatured: testimonial.isFeatured,
        displayOrder: testimonial.displayOrder,
        quote: translation.quote || '',
        photo: testimonial.photoFile
          ? {
              fileId: testimonial.photoFile.fileId,
              filePath: testimonial.photoFile.filePath,
              altText: testimonial.photoFile.altText,
            }
          : null,
      };
    });
  }

  /**
   * Get single public testimonial by ID
   */
  static async getPublicTestimonialById(testimonialId: number, locale: Locale) {
    const testimonial: any = await prisma.testimonial.findFirst({
      where: {
        testimonialId,
        isActive: true,
        deletedAt: null,
      },
      include: {
        translations: {
          where: { locale },
        },
        photoFile: {
          select: {
            fileId: true,
            filePath: true,
            altText: true,
          },
        },
      },
    });

    if (!testimonial) {
      throw new NotFoundError('Testimonial not found');
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
      quote: translation.quote || '',
      photo: testimonial.photoFile
        ? {
            fileId: testimonial.photoFile.fileId,
            filePath: testimonial.photoFile.filePath,
            altText: testimonial.photoFile.altText,
          }
        : null,
    };
  }

  /**
   * Get all testimonials with all translations (Admin)
   */
  static async getAllTestimonials(
    page: number,
    limit: number,
    search?: string,
    isFeatured?: string,
    isActive?: string
  ) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { translations: { some: { quote: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true';
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [total, testimonials]: any = await Promise.all([
      prisma.testimonial.count({ where }),
      prisma.testimonial.findMany({
        where,
        include: {
          translations: {
            orderBy: { locale: 'asc' },
          },
          photoFile: {
            select: {
              fileId: true,
              filePath: true,
              altText: true,
            },
          },
          creator: {
            select: {
              userId: true,
              username: true,
              email: true,
            },
          },
          updater: {
            select: {
              userId: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { displayOrder: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    const result = testimonials.map((testimonial: any) => ({
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
      translations: mergeAllTranslations(testimonial.translations),
    }));

    return {
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create new testimonial
   */
  static async createTestimonial(data: any, userId: number) {
    const { name, title, company, photoFileId, rating, isFeatured, displayOrder, translations } =
      data;

    // Validation
    if (!name || displayOrder === undefined) {
      throw new ValidationError('name and displayOrder are required');
    }

    if (!translations || !translations.id) {
      throw new ValidationError('Indonesian translation (id) is required');
    }

    // Verify photo file exists if provided
    if (photoFileId) {
      const photoFile = await prisma.mediaFile.findUnique({
        where: { fileId: photoFileId },
      });

      if (!photoFile) {
        throw new NotFoundError('Photo file not found');
      }
    }

    // Validate rating
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      throw new ValidationError('Rating must be between 1 and 5');
    }

    // Create testimonial
    const testimonial: any = await prisma.testimonial.create({
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
              locale: Locale.id,
              quote: translations.id.quote,
            },
            ...(translations.en
              ? [
                  {
                    locale: Locale.en,
                    quote: translations.en.quote,
                  },
                ]
              : []),
          ],
        },
      },
      include: {
        translations: true,
        photoFile: {
          select: {
            fileId: true,
            filePath: true,
            altText: true,
          },
        },
        creator: {
          select: {
            userId: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return {
      ...testimonial,
      translations: mergeAllTranslations(testimonial.translations),
    };
  }

  /**
   * Update testimonial
   */
  static async updateTestimonial(testimonialId: number, data: any, userId: number) {
    const { name, title, company, photoFileId, rating, isFeatured, displayOrder, isActive, translations } =
      data;

    // Check exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { testimonialId },
    });

    if (!existingTestimonial || existingTestimonial.deletedAt) {
      throw new NotFoundError('Testimonial not found');
    }

    // Verify photo file exists if provided
    if (photoFileId) {
      const photoFile = await prisma.mediaFile.findUnique({
        where: { fileId: photoFileId },
      });

      if (!photoFile) {
        throw new NotFoundError('Photo file not found');
      }
    }

    // Validate rating
    if (rating !== undefined && rating !== null && (rating < 1 || rating > 5)) {
      throw new ValidationError('Rating must be between 1 and 5');
    }

    // Update testimonial
    const updateData: any = {
      updatedBy: userId,
    };

    if (name) updateData.name = name;
    if (title !== undefined) updateData.title = title;
    if (company !== undefined) updateData.company = company;
    if (photoFileId !== undefined) updateData.photoFileId = photoFileId;
    if (rating !== undefined) updateData.rating = rating;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    await prisma.testimonial.update({
      where: { testimonialId },
      data: updateData,
    });

    // Update translations if provided
    if (translations) {
      for (const locale of Object.values(Locale)) {
        if (translations[locale]) {
          await prisma.testimonialTranslation.upsert({
            where: {
              testimonialId_locale: {
                testimonialId,
                locale,
              },
            },
            create: {
              testimonialId,
              locale,
              quote: translations[locale].quote,
            },
            update: {
              quote: translations[locale].quote,
            },
          });
        }
      }
    }

    // Fetch updated testimonial
    const updatedTestimonial: any = await prisma.testimonial.findUnique({
      where: { testimonialId },
      include: {
        translations: true,
        photoFile: {
          select: {
            fileId: true,
            filePath: true,
            altText: true,
          },
        },
        updater: {
          select: {
            userId: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return {
      ...updatedTestimonial,
      translations: mergeAllTranslations(updatedTestimonial.translations),
    };
  }

  /**
   * Soft delete testimonial
   */
  static async deleteTestimonial(testimonialId: number, userId: number) {
    const testimonial = await prisma.testimonial.findUnique({
      where: { testimonialId },
    });

    if (!testimonial || testimonial.deletedAt) {
      throw new NotFoundError('Testimonial not found');
    }

    await prisma.testimonial.update({
      where: { testimonialId },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy: userId,
      },
    });
  }
}
