import DetailCard from '@/components/DetailCard';
import { PiStudent } from 'react-icons/pi';

export default function Home() {
  return (
    <div className='section'>
      <DetailCard number={123} title='Students' icon={<PiStudent />} />
    </div>
  );
}
