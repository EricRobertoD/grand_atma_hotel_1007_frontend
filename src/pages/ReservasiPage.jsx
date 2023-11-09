
// const [isNewModalOpen, setIsNewModalOpen] = useState(false);

// const openNewModal = () => {
//     setIsNewModalOpen(true);
//   };



  
//   <Button
//   color="secondary"
//   variant="flat"
//   onClick={() => {
//     setReservasi(row);
//     openNewModal();
//   }}
// >
//   Nota
// </Button>


// const totalKamarPrice = reservasi?.transaksi_kamar.reduce(
//     (total, transaksi_kamar) =>
//       total + transaksi_kamar.harga_total * transaksi_kamar.jumlah,
//     0
//   );

//   const totalFasilitasPrice = reservasi?.transaksi_fasilitas_tambahan.reduce(
//     (total, transaksi_fasilitas_tambahan) =>
//       total + transaksi_fasilitas_tambahan.total_harga_fasilitas,
//     0
//   );

// <Modal
//         size={"2xl"}
//         isOpen={isNewModalOpen}
//         onOpenChange={() => setIsNewModalOpen(false)}
//         scrollBehavior={"inside"}
//       ><ModalContent>
//           <ModalHeader className="flex flex-col gap-1">
//             Detail Reservasi
//           </ModalHeader>
//           <ModalBody>
//             <div className="py-5 px-5">
//               <div className="text-center">
//                 <div className="mb-4">
//                   <img
//                     src="https://firebasestorage.googleapis.com/v0/b/capstone-cdb77.appspot.com/o/logo.png?alt=media&token=c134b6af-1e0d-434e-b381-dcd077196515&_gl=1*a58tki*_ga*MjEyODU5OTQ5MC4xNjg5OTc4NjE0*_ga_CW55HF8NVT*MTY5NzUyMjg4Ni4yNC4xLjE2OTc1MjI5MzYuMTAuMC4w"
//                     alt="Logo"
//                   />
//                 </div>
//                 <p>Jl. P. Mangkubumi No.18, Yogyakarta 55233</p>
//               </div>
//               <hr className="mb-4" />
//               <div className="text-center">
//                 <h3 className="font-weight-bold">INVOICE</h3>
//               </div>
//               <hr className="mb-4" />
//               <div className="text-end">
//                 <p>Tgl. Reservasi: <b>{reservasi?.tanggal_reservasi || "-"}</b></p>
//                 <p>No. Invoice: <b>{reservasi?.nota_pelunasan[0]?.no_nota || "-"}</b></p>
//                 <p>FO: <b>{reservasi?.nota_pelunasan[0]?.pegawai?.nama_pegawai || "-"}</b></p>
//               </div>
//               <div className="text-start mt-2">
//                 <p>ID Booking: <b>{reservasi?.tanggal_reservasi || "-"}</b></p>
//                 <p>Nama: <b>{reservasi?.customer?.nama || "-"}</b></p>
//                 <p>Alamat: <b>{reservasi?.customer?.alamat || "-"}</b></p>
//               </div>
//               <hr className="mt-4 mb-2" />
//               <div className="text-center">
//                 <h3 className="font-weight-bold">DETAIL</h3>
//               </div>
//               <hr className="mb-3" />
//               <div className="text-start">
//                 <p>Check In: <b>{reservasi?.tanggal_checkin || "-"}</b></p>
//                 <p>Check Out: <b>{reservasi?.tanggal_checkout || "-"}</b></p>
//                 <p>Dewasa: <b>{reservasi?.dewasa || "-"}</b></p>
//                 <p>Anak: <b>{reservasi?.anak || "-"}</b></p>
//               </div>
//               <hr className="mt-4 mb-3" />
//               <div className="text-center">
//                 <h3 className="font-weight-bold">KAMAR</h3>
//               </div>
//               <hr className="mb-3" />
//               <table>
//                 <thead>
//                   <tr>
//                     <th colSpan={2}>Jenis Kamar</th>
//                     <th colSpan={2}>Bed</th>
//                     <th colSpan={2}>Jumlah</th>
//                     <th colSpan={2}>Harga</th>
//                     <th colSpan={2}>Sub Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reservasi?.transaksi_kamar?.map((transaksi_kamar) => (
//                     <tr key={transaksi_kamar?.id_transaksi_kamar}>
//                       <td>{transaksi_kamar?.kamar?.jenis_kamar?.jenis_kamar}</td>
//                       <td>{transaksi_kamar?.kamar?.pilih_bed}</td>
//                       <td>{transaksi_kamar?.jumlah}</td>
//                       <td>Rp{transaksi_kamar?.kamar?.jenis_kamar?.harga_default}</td>
//                       <td>Rp{transaksi_kamar?.harga_total}</td>
//                     </tr>
//                   ))}
//                   <tr>
//                     <td colSpan="5" className="text-right">
//                       <b>Rp.{totalKamarPrice}</b>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//               <hr className="mt-4 mb-3" />
//               <div className="text-center">
//                 <h3 className="font-weight-bold">FASILITAS</h3>
//               </div>
//               <hr className="mb-3" />
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Fasilitas</th>
//                     <th>Jumlah</th>
//                     <th>Harga</th>
//                     <th>Sub Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reservasi?.transaksi_fasilitas_tambahan.map(
//                     (transaksi_fasilitas_tambahan) => (
//                       <tr key={transaksi_fasilitas_tambahan}>
//                         <td>{transaksi_fasilitas_tambahan?.fasilitas_tambahan?.fasilitas_tambahan}</td>
//                         <td>{transaksi_fasilitas_tambahan?.jumlah}</td>
//                         <td>Rp{transaksi_fasilitas_tambahan?.fasilitas_tambahan?.tarif}</td>
//                         <td>Rp{transaksi_fasilitas_tambahan?.total_harga_fasilitas}</td>
//                       </tr>
//                     )
//                   )}
//                   <tr>
//                     <td colSpan="4" className="text-right">
//                       <b>Rp{totalFasilitasPrice}</b>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//               <div className="text-end mt-4">
//                 <p>Tax: <b>Rp{totalFasilitasPrice * 0.1}</b></p>
//                 <p>TOTAL: <b>Rp{totalFasilitasPrice + totalKamarPrice + totalFasilitasPrice * 0.1} </b></p>
//                 <p className="mt-4">Jaminan: <b>Rp300000</b></p>
//                 <p>Deposit: <b>Rp300000</b></p>
//               </div>
//               <hr className="mt-4 mb-2" />
//               <p className="text-center">Thank You for Your Visit!</p>
//               <hr className="mt-2 mb-2" />
//             </div>
//           </ModalBody>
//         </ModalContent>
//       </Modal>