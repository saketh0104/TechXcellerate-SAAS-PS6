import { getSubscriptions, addSubscription, updateSubscription, deleteSubscription } from "../Api";
import axios from "axios";
import { vi } from "vitest";
import type { AxiosInstance, AxiosInterceptorManager } from "axios";

vi.mock("axios", () => {
    const mockInterceptorManager: AxiosInterceptorManager<any> = {
      use: vi.fn(),
      eject: vi.fn(),
      clear: vi.fn(),
    };
  
    const mockAxiosInstance: Partial<AxiosInstance> = {
      interceptors: {
        request: mockInterceptorManager,
        response: mockInterceptorManager,
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
  
    const axiosMock = {
      create: vi.fn(() => mockAxiosInstance as AxiosInstance),
      interceptors: mockAxiosInstance.interceptors,
      get: mockAxiosInstance.get,
      post: mockAxiosInstance.post,
      put: mockAxiosInstance.put,
      delete: mockAxiosInstance.delete,
    };
  
    return {
      default: axiosMock,
    };
  });

describe("API module", () => {
  const mockAxiosInstance = axios as unknown as jest.Mocked<typeof axios>;

  it("should include Authorization header if token is present", async () => {
    localStorage.setItem("token", "test-token");

    await getSubscriptions();

    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith("/subscriptions");
  });

  it("should call addSubscription with correct data", async () => {
    const mockData = { name: "Netflix", cost: 10 };

    await addSubscription(mockData);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith("/subscriptions", mockData);
  });

  it("should call updateSubscription with correct data", async () => {
    const mockId = "123";
    const mockData = { name: "Netflix", cost: 15 };

    await updateSubscription(mockId, mockData);

    expect(mockAxiosInstance.put).toHaveBeenCalledWith(`/subscriptions/${mockId}`, mockData);
  });

  it("should call deleteSubscription with correct ID", async () => {
    const mockId = "123";

    await deleteSubscription(mockId);

    expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/subscriptions/${mockId}`);
  });
});