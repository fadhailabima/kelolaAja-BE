import { Locale } from "@prisma/client";
import { ValidationError } from "../../src/utils/errors";
import { mockPrisma, resetAllMocks } from "../helpers/prismaMock";

jest.mock("../../src/utils/prisma", () => ({
  prisma: mockPrisma
}));

import { IndustryService } from "../../src/services/industry.service";

beforeEach(() => {
  resetAllMocks();
});

describe("IndustryService", () => {
  test("createIndustry mewajibkan translasi bahasa Indonesia", async () => {
    const payload: any = {
      industryCode: "IND_TEST",
      slug: "ind-test",
      displayOrder: 1,
      translations: {
        en: {
          title: "Test",
          description: "Desc",
          introText: "Intro"
        }
      }
    };

    await expect(IndustryService.createIndustry(payload, 1)).rejects.toThrow(ValidationError);
    expect(mockPrisma.industry.findFirst).not.toHaveBeenCalled();
  });

  test("getPublicIndustries mengembalikan data terformat", async () => {
    mockPrisma.industry.findMany.mockResolvedValue([
      {
        industryId: 1,
        industryCode: "IND_MANU",
        slug: "manufaktur",
        displayOrder: 1,
        translations: [
          { locale: Locale.id, title: "Manufaktur", description: "Desc id", introText: "Intro id" },
          { locale: Locale.en, title: "Manufacturing", description: "Desc en", introText: "Intro en" }
        ],
        problems: [
          {
            problemId: 10,
            displayOrder: 1,
            translations: [{ locale: Locale.id, title: "Problem", description: "P Desc" }]
          }
        ],
        solutions: [
          {
            solutionId: 20,
            displayOrder: 1,
            translations: [{ locale: Locale.id, title: "Solution", description: "S Desc" }]
          }
        ],
        media: [
          {
            industryMediaId: 30,
            mediaType: "image",
            usage: "hero",
            displayOrder: 1,
            mediaFile: {
              fileId: 99,
              filePath: "/img.jpg",
              fileName: "img.jpg",
              altText: "Hero"
            }
          }
        ]
      }
    ]);

    const result = await IndustryService.getPublicIndustries(Locale.id);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      industryCode: "IND_MANU",
      title: "Manufaktur",
      problems: [
        {
          title: "Problem",
          description: "P Desc"
        }
      ],
      solutions: [
        {
          title: "Solution"
        }
      ],
      media: [
        {
          file: {
            filePath: "/img.jpg"
          }
        }
      ]
    });
  });
});
