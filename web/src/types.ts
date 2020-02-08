export enum TContentType {
  Folder = 4,
  File = 8,
}

export enum TIsTextFile {
  CheckFail = -1,
  Not = 0,
  Yes = 1,
}

export type TContent = (
  {
    name: string
    type: TContentType.Folder
  } |
  {
    name: string
    type: TContentType.File
    isTextFile: TIsTextFile
  }
)
