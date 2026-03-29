export type TDataBodyCreateSong = {
  title: string;
  avatar: string;
  description: string;
  lyrics: string;
  audio: string;
  position: number;
  status: string;
  topicId: string;
  singers?: string[];
  singerGroups?: string[];
};

export type TDataBodyUpdateSong = {
  title: string;
  avatar: string;
  description: string;
  lyrics: string;
  audio: string;
  position: number;
  status: string;
  topicId: string;
  singers?: string[];
  singerGroups?: string[];
};
