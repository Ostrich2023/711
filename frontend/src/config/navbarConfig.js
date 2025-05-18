import {
  IconHome2,
  IconClipboardList,
  IconSettings,
  IconBook2,
  IconUser,
  IconCertificate,
  IconUsersGroup,
  IconBriefcase
} from "@tabler/icons-react";

export const getNavbarByRole = (role) => {
  switch (role) {
    case "student":
      return [
        { link: "", labelKey: "navbar.home", icon: IconHome2 },
        { link: "profile", labelKey: "navbar.profile", icon: IconUser },
        { link: "request-skill", labelKey: "navbar.requestSkill", icon: IconClipboardList },
        { link: "wallet", labelKey: "navbar.wallet", icon: IconCertificate },
        { link: "courses", labelKey: "navbar.courses", icon: IconBook2 },
        { link: "settings", labelKey: "navbar.settings", icon: IconSettings }
      ];

    case "school":
    case "teacher":
      return [
        { link: "", labelKey: "navbar.home", icon: IconHome2 },
        { link: "verify-skill", labelKey: "school.verifySkills", icon: IconClipboardList },
        { link: "manage-courses", labelKey: "school.manageCourses", icon: IconBook2 },
        { link: "settings", labelKey: "navbar.settings", icon: IconSettings }
      ];

    case "employer":
      return [
        { link: "", labelKey: "navbar.home", icon: IconHome2 },
        { link: "jobs", labelKey: "employer.jobManagement", icon: IconBriefcase },
        { link: "settings", labelKey: "navbar.settings", icon: IconSettings }
      ];

    case "admin":
      return [
        { link: "", labelKey: "navbar.home", icon: IconHome2 },
        { link: "manage-users", labelKey: "admin.manageUsers", icon: IconUsersGroup },
        { link: "settings", labelKey: "navbar.settings", icon: IconSettings }
      ];

    default:
      return [];
  }
};
