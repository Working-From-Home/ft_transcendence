import http from '@/http';
import { IFriend } from '@/models/IFriendLists';

class FriendService {
  async getFriendships(userId: number, status: string): Promise<IFriend[]> {
    const friendships = await http.get(`/users/${userId}/friends?status=${status}`);
    let list: IFriend[] = [];
    friendships.data.forEach((friendship: any) => {
      list.push({ id: friendship.id, username: friendship.username });
    });
    return list;
  }
  async sendFriendRequest(applicantId: number, recipientId: number) {
    return await http.post(`/users/${applicantId}/friends/${recipientId}`);
  }
  async acceptFriendship(applicantId: number, recipientId: number) {
    return await http.patch(`/users/${applicantId}/friends/${recipientId}`);
  }
  async endFriendship(applicantId: number, recipientId: number, status: string) {
    return await http.delete(`/users/${applicantId}/friends/${recipientId}?status=${status}`);
  }
}
export default new FriendService();
