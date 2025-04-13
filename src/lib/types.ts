import { SVGProps } from 'react';
import 'next-auth';

export interface HeroIcon extends SVGProps<SVGSVGElement> {
  title?: string;
  titleId?: string;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
  }
} 