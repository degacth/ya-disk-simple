export class DiskApi {
  private baseUrl: string = 'https://cloud-api.yandex.net/v1/disk'

  constructor(private token: string) {
  }

  uploadResource(file: File, path: string) {
    return this
    .getUploadInfo(path)
    .then(info => this.uploadFile(info, file))
  }

  publishResource(path: string) {
    return this.callApi<DiskLink>('/resources/publish', {method: 'put'}, {path})
  }

  resource(path: string) {
    return this.callApi<ResourceMeta>('/resources', {method: 'get'}, {path})
  }

  private getUploadInfo(path: string) {
    return this.callApi<DiskLink>('/resources/upload', {method: 'get'}, {path, overwrite: true})
  }

  private uploadFile(resource: DiskLink, file: File) {
    return new Promise<[File, XMLHttpRequest]>((res, rej) => {
      const xhr = new XMLHttpRequest()
      xhr.onloadend = (e) => res([file, xhr])
      xhr.onerror = e => rej(e)
      xhr.open(resource.method, resource.href)
      xhr.send(file)
    })
  }

  private callApi<T>(path: string, params: any, query: any = null) {
    const queryStr = query ? `?${new URLSearchParams(query)}` : ''

    const result = fetch(`${this.baseUrl}${path}${queryStr}`, {
      headers: {
        Authorization: `OAuth ${this.token}`,
      },
      ...params,
    })

    return result.then(v => v.json() as T)
  }
}

type DiskLink = {
  href: string
  method: 'PUT'
  templated: false
}

export type ResourceMeta = {
  antivirus_status: string
  public_key: string
  public_url: string
  name: string
  exif: {}
  created: string
  size: number
  resource_id: string
  modified: string
  mime_type: string
  comment_ids: {
    private_resource: string
    public_resource: string
  },
  sizes: {
    url: string,
    name: "ORIGINAL" | "DEFAULT" | "XXXS" | "XXS" | "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | "C"
  }[]

  "file": string
  "media_type": string
  "preview": string
  "path": string
  "sha256": string
  "type": string
  "md5": string
  "revision": number
}
