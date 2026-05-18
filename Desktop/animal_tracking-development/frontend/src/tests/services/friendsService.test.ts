import { friendsService } from "../../services/friendsService";
import { privateApi } from "../../api/privateApi";

vi.mock("../../api/privateApi", () => ({
  privateApi: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockFriends = [
  { id: "u-1", username: "Ania", avatar: "a1" },
  { id: "u-2", username: "Olek", avatar: "a2" },
];

describe("friendsService", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns friends list from API", async () => {
    vi.mocked(privateApi.get).mockResolvedValue({ data: mockFriends });

    const friends = await friendsService.getFriends();

    expect(friends).toHaveLength(2);
    expect(friends[0]?.username).toBe("Ania");
  });

  it("removes friend and refreshes list", async () => {
    vi.mocked(privateApi.delete).mockResolvedValue({});
    vi.mocked(privateApi.get).mockResolvedValue({ data: [mockFriends[1]] });

    const updated = await friendsService.removeFriend("u-1");

    expect(privateApi.delete).toHaveBeenCalledWith("/friends/u-1/");
    expect(updated).toHaveLength(1);
    expect(updated[0]?.id).toBe("u-2");
  });

  it("returns friend ids list", async () => {
    vi.mocked(privateApi.get).mockResolvedValue({ data: mockFriends });

    const friendIds = await friendsService.getFriendIds();

    expect(friendIds).toEqual(["u-1", "u-2"]);
  });
});
