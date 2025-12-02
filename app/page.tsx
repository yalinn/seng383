import Iso15939Provider from './components/Iso15939Provider';
import Iso15939Slider from './components/Iso15939Slider';

export default function Home() {
  return (
    <Iso15939Provider>
      <Iso15939Slider />
    </Iso15939Provider>
  );
}
