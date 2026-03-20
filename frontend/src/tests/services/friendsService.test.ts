describe("friendsService", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("returns initial friends list", async () => {
    const { friendsService } = await import("../../services/friendsService");

    const friends = await friendsService.getFriends();

    expect(friends.length).toBeGreaterThan(0);
  });

  it("returns a copy of friends list", async () => {
    const { friendsService } = await import("../../services/friendsService");

    const first = await friendsService.getFriends();
    first.pop();
    const second = await friendsService.getFriends();

    expect(second.length).toBeGreaterThan(first.length);
  });

  it("removes friend by id", async () => {
    const { friendsService } = await import("../../services/friendsService");

    const before = await friendsService.getFriends();
    const friendId = before[0]?.id;

    expect(friendId).toBeDefined();

    const after = await friendsService.removeFriend(friendId as string);

    expect(after.some((friend) => friend.id === friendId)).toBe(false);
    expect(after.length).toBe(before.length - 1);
  });
});
