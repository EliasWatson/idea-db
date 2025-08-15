import { Lightbulb } from 'lucide-react';
import { ComponentProps } from 'react';

export default function AppLogoIcon(props: ComponentProps<typeof Lightbulb>) {
  return <Lightbulb {...props} />;
}
