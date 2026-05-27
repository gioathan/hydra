import { LegalScreen } from '../../../../components/LegalScreen';
import { privacyPolicySections } from '../../../../lib/legalContent';

export default function PrivacyPolicyScreen() {
  return (
    <LegalScreen
      title="Privacy Policy"
      lastUpdated="1 January 2025"
      sections={privacyPolicySections}
      shareMessage="Privacy Policy — HYDRA Mediterranean\nhttps://hydra.gr/privacy-policy"
    />
  );
}
