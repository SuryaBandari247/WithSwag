export interface WithSwagApp {
  name: string;
  path: string;
  icon: string;
  description: string;
}

export const WITHSWAG_APPS: WithSwagApp[] = [
  { name: 'Portrait Photo', path: '/portrait/', icon: 'Camera', description: 'Passport & ID photos' },
  { name: 'SRT Editor', path: '/srt-editor/', icon: 'FileText', description: 'Subtitle file editor' },
];
