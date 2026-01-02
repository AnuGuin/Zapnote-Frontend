import { apiClient } from './client';
import type {
  WorkspaceWithRole,
  WorkspaceMemberWithUser,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  AddMemberInput,
  UpdateMemberRoleInput,
  ApiResponse,
} from '@/src/types/workspace';

export const workspacesApi = {
  // Get all workspaces for current user
  async getWorkspaces(): Promise<WorkspaceWithRole[]> {
    const response = await apiClient.get<ApiResponse<WorkspaceWithRole[]>>(
      '/api/v1/users/me/workspaces'
    );
    return response.data;
  },

  // Get a specific workspace
  async getWorkspace(workspaceId: string): Promise<WorkspaceWithRole> {
    const response = await apiClient.get<ApiResponse<WorkspaceWithRole>>(
      `/api/v1/workspaces/${workspaceId}`
    );
    return response.data;
  },

  // Create a new workspace
  async createWorkspace(input: CreateWorkspaceInput): Promise<WorkspaceWithRole> {
    const response = await apiClient.post<ApiResponse<WorkspaceWithRole>>(
      '/api/v1/workspaces',
      input
    );
    return response.data;
  },

  // Update workspace
  async updateWorkspace(
    workspaceId: string,
    input: UpdateWorkspaceInput
  ): Promise<WorkspaceWithRole> {
    const response = await apiClient.patch<ApiResponse<WorkspaceWithRole>>(
      `/api/v1/workspaces/${workspaceId}`,
      input
    );
    return response.data;
  },

  // Delete workspace
  async deleteWorkspace(workspaceId: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(
      `/api/v1/workspaces/${workspaceId}`
    );
  },

  // Get workspace members
  async getMembers(workspaceId: string): Promise<WorkspaceMemberWithUser[]> {
    const response = await apiClient.get<ApiResponse<WorkspaceMemberWithUser[]>>(
      `/api/v1/workspaces/${workspaceId}/members`
    );
    return response.data;
  },

  // Add member to workspace
  async addMember(
    workspaceId: string,
    input: AddMemberInput
  ): Promise<WorkspaceMemberWithUser> {
    const response = await apiClient.post<ApiResponse<WorkspaceMemberWithUser>>(
      `/api/v1/workspaces/${workspaceId}/members`,
      input
    );
    return response.data;
  },

  // Update member role
  async updateMemberRole(
    workspaceId: string,
    memberId: string,
    input: UpdateMemberRoleInput
  ): Promise<WorkspaceMemberWithUser> {
    const response = await apiClient.patch<ApiResponse<WorkspaceMemberWithUser>>(
      `/api/v1/workspaces/${workspaceId}/members/${memberId}`,
      input
    );
    return response.data;
  },

  // Remove member from workspace
  async removeMember(workspaceId: string, memberId: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(
      `/api/v1/workspaces/${workspaceId}/members/${memberId}`
    );
  },

  // Leave workspace
  async leaveWorkspace(workspaceId: string): Promise<void> {
    await apiClient.post<ApiResponse<null>>(
      `/api/v1/workspaces/${workspaceId}/leave`
    );
  },
};