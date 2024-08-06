import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function Menu() {
    const pathname = usePathname()

    const links = [
      { id:1, title: 'Profile', path: '../account/profile', icon: 'UilUser' },
      { id:2, title: 'Orders', path: '../account/history', icon: 'UilHistory' },
      { id:3, title: 'Security', path: '../account/security', icon: 'UilShield' }
    ]
  return (
    <div>
        <ul>
            {links.map((link) => (
              <li className={pathname === link.path.replace("..","") ? 'hover-red active ' : 'hover-red'} key={link.id}>
                <Link href={link.path}>
                  {/* <UilApps size='20'/> */}
                  {link.title}
                </Link>
              </li>
            ))}
        </ul>
    </div>
  )
}
