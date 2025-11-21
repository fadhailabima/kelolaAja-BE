export const mockPrisma = {
  industry: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  industryTranslation: {
    upsert: jest.fn()
  },
  industryProblem: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  industryProblemTranslation: { deleteMany: jest.fn(), upsert: jest.fn() },
  industrySolution: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  industrySolutionTranslation: { deleteMany: jest.fn(), upsert: jest.fn() },
  industryMedia: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  mediaFile: {
    findUnique: jest.fn()
  },
  featurePage: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  featurePageTranslation: {
    upsert: jest.fn()
  },
  featurePageItem: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  featurePageItemTranslation: {
    upsert: jest.fn(),
    deleteMany: jest.fn()
  },
  featureMaster: {
    findUnique: jest.fn()
  },
  visitor: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn()
  },
  pageView: {
    create: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
    findMany: jest.fn()
  },
  pageViewEvent: {
    count: jest.fn()
  }
};

export const resetAllMocks = () => {
  Object.values(mockPrisma).forEach(model => {
    Object.values(model).forEach(fn => {
      if (typeof fn === "function" && "mockClear" in fn) {
        (fn as jest.Mock).mockReset();
      }
    });
  });
};
