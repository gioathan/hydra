import { LegalScreen } from '../../../../components/LegalScreen';
import { termsOfServiceSections } from '../../../../lib/legalContent';

export default function TermsOfServiceScreen() {
  return (
    <LegalScreen
      title="Terms of Service"
      lastUpdated="1 January 2025"
      sections={termsOfServiceSections}
      shareMessage="Terms of Service — Local Bee Mediterranean\nhttps://hydra.gr/terms-of-service"
    />
  );
}
