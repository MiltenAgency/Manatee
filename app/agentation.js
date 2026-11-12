'use client';

import { Agentation } from 'agentation';

export default function DevAgentation() {
  return process.env.NODE_ENV === 'development' ? <Agentation /> : null;
}
