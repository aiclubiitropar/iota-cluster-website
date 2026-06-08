import { getTeamMembers, createTeamMember } from "@/actions/team";
import { revalidatePath } from "next/cache";

export default async function AdminTeamPage() {
  const members = await getTeamMembers();

  async function addMember(formData: FormData) {
    "use server";
    await createTeamMember({
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      linkedinUrl: formData.get("linkedinUrl") as string || undefined,
      githubUrl: formData.get("githubUrl") as string || undefined,
    });
    revalidatePath("/admin/team");
    revalidatePath("/team");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-outfit mb-6">Manage Team</h1>
      
      <div className="glass-panel p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Add New Member</h2>
        <form action={addMember} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Full Name *" required className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--glass-border)] text-white" />
            <input type="text" name="position" placeholder="Position *" required className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--glass-border)] text-white" />
            <input type="url" name="imageUrl" placeholder="Image URL (Optional)" className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--glass-border)] text-white" />
            <input type="url" name="linkedinUrl" placeholder="LinkedIn URL (Optional)" className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--glass-border)] text-white" />
            <input type="url" name="githubUrl" placeholder="GitHub URL (Optional)" className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--glass-border)] text-white" />
          </div>
          <button type="submit" className="btn-primary mt-2 self-start">Add Member</button>
        </form>
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-lg font-bold mb-4">Current Members</h2>
        {members.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No members added yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--glass-border)]">
            {members.map(m => (
              <li key={m.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold">{m.name}</p>
                  <p className="text-sm text-[var(--accent-cyan)]">{m.position}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
