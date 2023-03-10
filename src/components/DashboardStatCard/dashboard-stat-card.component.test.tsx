import { render } from '@testing-library/react';
import { LightningBoltIcon } from '@heroicons/react/outline';

import DashboardStatCard from './dashboard-stat-card.component';

describe('DashboardStatCard', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <DashboardStatCard title="Total clicks" count={182} icon={<LightningBoltIcon width={32} />} />
    );

    expect(getByText('Total clicks')).toBeInTheDocument();
    expect(getByText('182')).toBeInTheDocument();
  });
});
