import { NotFoundError } from "../../src/utils/errors";
import { mockPrisma, resetAllMocks } from "../helpers/prismaMock";

jest.mock("../../src/utils/prisma", () => ({
  prisma: mockPrisma
}));

import { AnalyticsService } from "../../src/services/analytics.service";

beforeEach(() => {
  resetAllMocks();
});

describe("AnalyticsService", () => {
  test("trackVisitor membuat visitor baru ketika tidak ada visitorId", async () => {
    mockPrisma.visitor.create.mockResolvedValue({
      visitorId: 1,
      ipAddress: "127.0.0.1"
    });

    const visitor = await AnalyticsService.trackVisitor({ ipAddress: "127.0.0.1" });
    expect(visitor.visitorId).toBe(1);
    expect(mockPrisma.visitor.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ ipAddress: "127.0.0.1" })
    });
  });

  test("trackVisitor meng-update visitor saat visitorId valid dikirim", async () => {
    mockPrisma.visitor.findUnique.mockResolvedValue({
      visitorId: 5,
      ipAddress: "1.1.1.1",
      userAgent: "old",
      referrer: null,
      countryCode: null,
      city: null,
      deviceType: null,
      browser: null,
      os: null,
      isBot: false
    });
    mockPrisma.visitor.update.mockResolvedValue({ visitorId: 5 });

    const result = await AnalyticsService.trackVisitor({ visitorId: 5, userAgent: "new" });
    expect(result.visitorId).toBe(5);
    expect(mockPrisma.visitor.update).toHaveBeenCalled();
  });

  test("trackPageView melempar error jika visitor tidak ditemukan", async () => {
    mockPrisma.visitor.findUnique.mockResolvedValue(null);

    await expect(
      AnalyticsService.trackPageView({ visitorId: 99, pagePath: "/", events: [], pageTitle: "Home" })
    ).rejects.toThrow(NotFoundError);
  });

  test("trackPageView membuat record saat visitor valid", async () => {
    mockPrisma.visitor.findUnique.mockResolvedValue({ visitorId: 1 });
    mockPrisma.pageView.create.mockResolvedValue({ viewId: 1, events: [] });

    const view = await AnalyticsService.trackPageView({ visitorId: 1, pagePath: "/landing" });
    expect(view.viewId).toBe(1);
    expect(mockPrisma.pageView.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ visitorId: 1, pagePath: "/landing" }),
      include: { events: true }
    });
  });
});
