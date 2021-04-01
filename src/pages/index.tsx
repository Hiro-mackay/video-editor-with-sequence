import { useState, useEffect } from 'react';
import { Sequence } from '../components/Sequnce/Sequence';
import { SequenceTimetick } from '../components/Sequnce/SequenceTimetick';

import dynamic from 'next/dynamic';

const Pixi = dynamic(() => import('../container'), { ssr: false });

export default function Home() {
  return <Pixi />;
}
