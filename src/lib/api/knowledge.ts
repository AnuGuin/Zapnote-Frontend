import { apiClient } from './client';
import type {
  KnowledgeItem,
  CreateKnowledgeItemInput,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from '@/src/types/workspace';

export const knowledgeApi = {
  async createItem(
    workspaceId: string,
    input: CreateKnowledgeItemInput
  ): Promise<KnowledgeItem> {
    const response = await apiClient.post<ApiResponse<KnowledgeItem>>(
      `/api/v1/knowledge/${workspaceId}`,
      input
    );
    return response.data;
  },

  async getItems(
    workspaceId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<KnowledgeItem>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.type) queryParams.set('type', params.type);
    if (params?.status) queryParams.set('status', params.status);

    const query = queryParams.toString();
    const endpoint = `/api/v1/knowledge/${workspaceId}${query ? `?${query}` : ''}`;
    
    return await apiClient.get<PaginatedResponse<KnowledgeItem>>(endpoint);
  },

  async getItem(workspaceId: string, itemId: string): Promise<KnowledgeItem> {
    const response = await apiClient.get<ApiResponse<KnowledgeItem>>(
      `/api/v1/knowledge/${workspaceId}/${itemId}`
    );
    return response.data;
  },

  async updateItem(
    workspaceId: string,
    itemId: string,
    input: { userIntent?: string }
  ): Promise<KnowledgeItem> {
    const response = await apiClient.patch<ApiResponse<KnowledgeItem>>(
      `/api/v1/knowledge/${workspaceId}/${itemId}`,
      input
    );
    return response.data;
  },

  async deleteItem(workspaceId: string, itemId: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(
      `/api/v1/knowledge/${workspaceId}/${itemId}`
    );
  },

  async getRecentItems(workspaceId: string, limit = 10): Promise<KnowledgeItem[]> {
    const response = await this.getItems(workspaceId, { limit, page: 1 });
    return response.data;
  },
};