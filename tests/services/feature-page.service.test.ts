import { Locale } from "@prisma/client";
import { ValidationError, NotFoundError } from "../../src/utils/errors";
import { mockPrisma, resetAllMocks } from "../helpers/prismaMock";

jest.mock("../../src/utils/prisma", () => ({
  prisma: mockPrisma
}));

import { FeaturePageService } from "../../src/services/feature-page.service";

beforeEach(() => {
  resetAllMocks();
});

describe("FeaturePageService", () => {
  test("createPage mewajibkan translasi bahasa Indonesia", async () => {
    const payload: any = {
      featureId: 1,
      pageCode: "PAGE_TEST",
      slug: "page-test",
      translations: {}
    };

    await expect(FeaturePageService.createPage(payload, 1)).rejects.toThrow(ValidationError);
  });

  test("getPublicPageBySlug menggabungkan hero dan items", async () => {
    mockPrisma.featurePage.findFirst.mockResolvedValue({
      pageId: 1,
      pageCode: "PAGE_USER_MANAGEMENT",
      slug: "feature-user-management",
      featureId: 10,
      translations: [
        {
          locale: Locale.id,
          heroTitle: "Hero ID",
          heroSubtitle: "Subtitle",
          heroDescription: "Desc",
          aboutTitle: "About",
          aboutSubtitle: "Sub",
          aboutDescription1: "Desc1",
          aboutDescription2: "Desc2",
          ctaTitle: "CTA",
          ctaDescription: "CTA desc",
          ctaButtonText: "Ayo"
        }
      ],
      heroImageFile: {
        fileId: 1,
        filePath: "/hero.png",
        altText: "Hero"
      },
      items: [
        {
          itemId: 2,
          itemType: "highlight",
          displayOrder: 1,
          isActive: true,
          translations: [
            { locale: Locale.id, title: "Item", description: "Item Desc", shortDescription: "Short" }
          ],
          imageFile: null
        }
      ]
    });

    const page = await FeaturePageService.getPublicPageBySlug("feature-user-management", Locale.id);
    expect(page.heroTitle).toBe("Hero ID");
    expect(page.items).toHaveLength(1);
    expect(page.items[0]).toMatchObject({ title: "Item", shortDescription: "Short" });
  });

  test("getPublicPageBySlug lempar NotFound saat slug tidak ada", async () => {
    mockPrisma.featurePage.findFirst.mockResolvedValue(null);

    await expect(FeaturePageService.getPublicPageBySlug("unknown", Locale.id)).rejects.toThrow(NotFoundError);
  });
});
