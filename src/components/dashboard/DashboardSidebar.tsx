import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Bookmark,
  GitFork,
  AlertCircle,
  Search,
  LogOut,
  User,
  Settings,
  GitPullRequest,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { title: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Contributions", icon: GitPullRequest, path: "/dashboard/contributions" },
  { title: "All Bookmarks", icon: Bookmark, path: "/dashboard/bookmarks" },
  { title: "Repositories", icon: GitFork, path: "/dashboard/repos" },
  { title: "Issues", icon: AlertCircle, path: "/dashboard/issues" },
  { title: "Search", icon: Search, path: "/search" },
  { title: "Profile Settings", icon: Settings, path: "/dashboard/profile" },
];

export function DashboardSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const githubUsername = user?.user_metadata?.user_name;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
          <span className="text-lg font-semibold">ContribForge</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <SidebarMenu>
          {githubUsername && (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate(`/u/${githubUsername}`)}>
                <ExternalLink className="h-4 w-4" />
                <span>View Portfolio</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
