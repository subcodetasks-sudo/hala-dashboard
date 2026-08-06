import RoleDetailsView from "@/features/permissions/components/role-details-view";

type RoleDetailsPageProps = {
  params: Promise<{ roleId: string }>;
};

export default async function RoleDetailsPage({ params }: RoleDetailsPageProps) {
  const { roleId } = await params;
  return <RoleDetailsView roleId={roleId} />;
}
