import { Container } from '@/components/Container'
import { DiamondIcon } from './DiamondIcon'

export function Footer():JSX.Element {
  return (
    <footer className="flex-none mt-10 bg-gray-700">
      <Container className="flex flex-col items-center justify-center md:flex-row">
        <div className="flex justify-center items-center mt-6">
          <p className="text-base text-slate-400">Copyright &copy; {new Date().getFullYear()}</p>
          <DiamondIcon className="ml-5 h-1.5 w-1.5 overflow-visible fill-blue-400 stroke-blue-400" />
          <p className="ml-2 text-slate-400">Made by Group 8</p>
        </div>
      </Container>
      <div className="flex justify-center text-white font-bold">
        <div className="py-4 pr-1 ">
          <p>Martins Aloba</p>
          <p>Manish Mahato</p>
          <p>Bibek Budhathoki</p>
        </div>
        <div className="pt-4 pl-14">
          <p>Dipendra Kunwar</p>
          <p>Nabin Shrestha</p>
          <p>Kishor Gurung</p>
        </div>
      </div>
    </footer>
  )
}
