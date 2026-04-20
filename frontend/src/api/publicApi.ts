import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

async function getData<T>(url: string): Promise<T> {
  const resp = await publicApi.get(url);
  return resp.data;
}
async function postData<T>(url: string, data: any): Promise<T> {
  const resp = await publicApi.post(url, data);
  return resp.data;
}

export { publicApi, getData, postData };
